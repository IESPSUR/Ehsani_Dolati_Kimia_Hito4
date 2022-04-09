package com.animals.con;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class test {

    @RequestMapping("/")
    public String home(){
        return "Hello World!";
    }
}