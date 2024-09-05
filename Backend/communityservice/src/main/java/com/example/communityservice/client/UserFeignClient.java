package com.example.communityservice.client;

import com.example.communityservice.dto.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "UserManagement", url = "http://localhost:9999")
public interface UserFeignClient {

    @GetMapping("/{id}")
    User getUserById(@PathVariable Long id);
}
