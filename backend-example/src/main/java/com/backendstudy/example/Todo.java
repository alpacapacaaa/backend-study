package com.backendstudy.example;

import java.time.Instant;

// openapi.yaml components.schemas.Todo 와 대응
public record Todo(
        String id,
        String title,
        String description,
        boolean completed,
        Instant dueDate,
        Instant createdAt,
        Instant updatedAt
) {}
