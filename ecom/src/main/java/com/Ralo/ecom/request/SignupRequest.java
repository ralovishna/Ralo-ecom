package com.Ralo.ecom.request;

import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String otp;
//    private String password;
}