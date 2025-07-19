package com.Ralo.ecom.response;

@lombok.Data
public class AuthResponse {
    public String jwt;
    public String message;
    public String role;
}