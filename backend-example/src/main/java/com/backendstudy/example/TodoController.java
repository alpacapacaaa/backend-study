package com.backendstudy.example;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/todos")
public class TodoController {

    // 인메모리 저장소. 서버를 재시작하면 초기화됩니다.
    private final Map<String, Todo> todos = new ConcurrentHashMap<>();

    public TodoController() {
        Todo seed = new Todo(
                UUID.randomUUID().toString(),
                "OpenAPI 명세 작성하기",
                "1주차 명세 초안 작성",
                false,
                Instant.parse("2026-08-01T00:00:00Z"),
                now(),
                now());
        todos.put(seed.id(), seed);
    }

    public record CreateRequest(String title, String description, String dueDate) {}

    @GetMapping
    public List<Todo> list(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String order) {

        if (!sort.equals("createdAt") && !sort.equals("dueDate")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "sort 파라미터는 createdAt 또는 dueDate 여야 합니다.");
        }
        if (!order.equals("asc") && !order.equals("desc")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "order 파라미터는 asc 또는 desc 여야 합니다.");
        }

        Comparator<Todo> comparator = Comparator.comparing(t -> sortKey(t, sort));
        if (order.equals("desc")) {
            comparator = comparator.reversed();
        }

        return todos.values().stream()
                .filter(t -> completed == null || completed.equals(t.completed()))
                .sorted(comparator)
                .toList();
    }

    private static Instant sortKey(Todo todo, String sort) {
        Instant value = sort.equals("dueDate") ? todo.dueDate() : todo.createdAt();
        return value == null ? Instant.EPOCH : value;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Todo create(@RequestBody CreateRequest req) {
        if (req.title() == null || req.title().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "title은 비어있지 않은 문자열이어야 합니다.");
        }

        Instant dueDate = parseDueDate(req.dueDate());
        Instant now = now();

        Todo todo = new Todo(UUID.randomUUID().toString(), req.title(), req.description(), false, dueDate, now, now);
        todos.put(todo.id(), todo);
        return todo;
    }

    @GetMapping("/{id}")
    public Todo getOne(@PathVariable String id) {
        return findOrThrow(id);
    }

    @PatchMapping("/{id}")
    public Todo update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Todo existing = findOrThrow(id);

        String title = existing.title();
        if (body.containsKey("title")) {
            Object value = body.get("title");
            if (!(value instanceof String s) || s.isBlank()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "title은 비어있지 않은 문자열이어야 합니다.");
            }
            title = s;
        }

        String description = existing.description();
        if (body.containsKey("description")) {
            Object value = body.get("description");
            if (value != null && !(value instanceof String)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "description은 문자열이어야 합니다.");
            }
            description = (String) value;
        }

        boolean completed = existing.completed();
        if (body.containsKey("completed")) {
            Object value = body.get("completed");
            if (!(value instanceof Boolean b)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "completed는 boolean이어야 합니다.");
            }
            completed = b;
        }

        Instant dueDate = existing.dueDate();
        if (body.containsKey("dueDate")) {
            Object value = body.get("dueDate");
            if (value != null && !(value instanceof String)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "dueDate는 문자열이어야 합니다.");
            }
            dueDate = value == null ? null : parseDueDate((String) value);
        }

        Todo updated = new Todo(existing.id(), title, description, completed, dueDate, existing.createdAt(), now());
        todos.put(id, updated);
        return updated;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        findOrThrow(id);
        todos.remove(id);
    }

    private Todo findOrThrow(String id) {
        Todo todo = todos.get(id);
        if (todo == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "해당 id의 todo를 찾을 수 없습니다.");
        }
        return todo;
    }

    // openapi.yaml 예시처럼 초 단위까지만(밀리초 없이) 내려주기 위해 잘라냅니다.
    private static Instant now() {
        return Instant.now().truncatedTo(ChronoUnit.SECONDS);
    }

    private static Instant parseDueDate(String raw) {
        if (raw == null) return null;
        try {
            return Instant.parse(raw);
        } catch (DateTimeParseException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "dueDate는 ISO 8601 형식(예: 2026-08-01T00:00:00Z)이어야 합니다.");
        }
    }
}
