package com.Ralo.ecom.service;

import com.Ralo.ecom.model.User;

public interface UserService {
    User findUserByJwtToken(String token) throws Exception;

    User findUserByEmail(String email) throws Exception;

}