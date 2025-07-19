package com.Ralo.ecom.exception;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

//@EqualsAndHashCode(callSuper = true)
@lombok.Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {
    private String error;
    private String details;
    private LocalDateTime timestamp = LocalDateTime.now();
}