package com.example.communityservice.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    private Long userId;
    private String userName;
    private String postTitle;
    private String postCaption;

    // Save the image as a URL pointing to the uploaded file
    private String imageUrl;

    // Likes count
    private int likes = 0;

    // Comments stored as a list of strings (can later be converted to a separate entity if needed)
    @ElementCollection
    private List<String> comments;

    // Constructors, Getters, and Setters (Lombok @Data handles this)
}
