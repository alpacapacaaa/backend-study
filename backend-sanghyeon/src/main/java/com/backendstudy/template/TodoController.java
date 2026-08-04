package com.backendstudy.template;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.time.Instant;
import java.util.stream.Stream;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// openapi.yaml 의 /todos 관련 엔드포인트를 구현하는 곳입니다.
// 아래 TODO를 하나씩 채워나가세요. 채우기 전까지는 501(Not Implemented)이 반환됩니다.
//
// 참고할 것:
//   - openapi.yaml 의 /todos, /todos/{todoId} 경로 정의
//   - mock-server/src/todos.js (같은 명세를 Node/Express로 구현한 예시)
//   - backend-example/ (막막할 때만 참고하는 완성본)
@RestController
@RequestMapping("/todos")
public class TodoController {

    // 인메모리 저장소. DB 없이 여기에 담아두면 됩니다. (서버 재시작하면 초기화됨)
    private final Map<String, Todo> todos = new ConcurrentHashMap<>();

    // POST 요청 바디 모양. openapi.yaml의 TodoCreateRequest 스키마와 대응합니다.
    public record CreateRequest(String title, String description, String dueDate) {}

    // PATCH 요청 바디 모양. 전부 선택 필드입니다 (부분 업데이트).
    public record UpdateRequest(String title, String description, Boolean completed, String dueDate) {}

    @GetMapping
    public List<Todo> list(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String order) {
        // TODO 1: completed 파라미터로 필터링하세요 (없으면 전체 반환).
        // TODO 2: sort("createdAt" | "dueDate"), order("asc" | "desc")로 정렬하세요.
        //         그 외 값이 들어오면 400(ApiException.BAD_REQUEST)을 던지세요.

        Stream<Todo> stream = todos.values().stream();

        if (completed != null) {
            stream = stream.filter(todo ->
                    completed.equals(todo.completed())
            );
        }

        Comparator<Todo> comparator;

        // sort 값 검증
        if (!sort.equals("createdAt") && !sort.equals("dueDate")) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "sort는 createdAt 또는 dueDate만 가능."
            );
        }

        if (!order.equals("asc") && !order.equals("desc")) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "order는 asc 또는 desc만 가능."
            );
        }
        if (sort.equals("createdAt")) {
            comparator = Comparator.comparing(Todo::createdAt);

            if (order.equals("desc")) {
                comparator = comparator.reversed();
            }
        } else {
            Comparator<Instant> dateComparator;

            if (order.equals("asc")) {
                dateComparator = Comparator.naturalOrder();
            } else {
                dateComparator = Comparator.reverseOrder();
            }

            comparator = Comparator.comparing(
                    Todo::dueDate,
                    Comparator.nullsLast(dateComparator)
            );
        }

        return stream
                .sorted(comparator)
                .toList();


    }

    @PostMapping
    public Todo create(@RequestBody CreateRequest req) {
        // TODO 1: title이 비어있으면 400을 던지세요.
        // TODO 2: dueDate 문자열을 Instant로 파싱하세요 (형식이 잘못되면 400).
        // TODO 3: id/createdAt/updatedAt을 채운 Todo를 만들어 todos에 저장하고,
        //         201 Created로 반환하세요. (Spring에서는 @ResponseStatus(HttpStatus.CREATED) 사용)

        if (req.title() == null || req.title().isBlank() ) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "타이틀은 비어 있을 수 없다");
        }

        Instant dueDate = null;

        if(req.dueDate()!= null) {
            try {
                dueDate = Instant.parse(req.dueDate());
            }
            catch (DateTimeParseException e) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "dueDate 형식 잘못됨");
            }
        }

        String id = UUID.randomUUID().toString();
        Instant now = Instant.now();

        Todo todo =new Todo(id, req.title(),req.description(),false, dueDate, now,now);

        todos.put(id, todo);

        return todo;

    }

    @GetMapping("/{id}")
    public Todo getOne(@PathVariable String id) {
        // TODO: id로 찾아서 반환하고, 없으면 404를 던지세요.
        Todo todo = todos.get(id);

        if (todo == null) {
            throw new ApiException(
                    HttpStatus.NOT_FOUND,
                    "Todo를 찾을 수 없읍."
            );
        }

        return todo;
    }

    @PatchMapping("/{id}")
    public Todo update(@PathVariable String id, @RequestBody UpdateRequest req) {
        // TODO 1: id로 기존 Todo를 찾고, 없으면 404를 던지세요.
        // TODO 2: req에 들어있는 필드만 갱신하세요 (null인 필드는 기존 값 유지).
        // TODO 3: updatedAt을 현재 시각으로 갱신하세요.
        Todo oldTodo = todos.get(id);

        if (oldTodo == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "todo가 업승");
        }

        Instant newDueDate = oldTodo.dueDate();


        String newTitle = req.title() != null ? req.title() :oldTodo.title();

        String newDescription = req.description() != null ? req.description :oldTodo.description();

        boolean newCompleted = req.completed() != null ? req.completed() : oldTodo.completed();

        Todo updatedTodo = new Todo(oldTodo.id(), newTitle, newDescription,newCompleted, newDueDate, oldTodo.createdAt(),Instant.now());

        todos.put(id, updatedTodo);
        return updatedTodo;

    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        // TODO: id로 찾아서 삭제하고, 없으면 404를 던지세요.
        //       성공 시 204 No Content로 응답하세요. (@ResponseStatus(HttpStatus.NO_CONTENT))

        Todo deletdTodo = todos.remove(id);
        if (deletdTodo == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "todo 찾을 수 없음");
        }
    }
}
