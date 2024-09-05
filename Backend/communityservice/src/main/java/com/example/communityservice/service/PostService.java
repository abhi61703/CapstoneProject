package com.example.communityservice.service;

import com.example.communityservice.client.UserFeignClient;
import com.example.communityservice.model.Post;
import com.example.communityservice.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserFeignClient userFeignClient;
    private static final String IMAGE_DIRECTORY = "uploads/";

    @Autowired
    public PostService(PostRepository postRepository, UserFeignClient userFeignClient) {
        this.postRepository = postRepository;
        this.userFeignClient = userFeignClient;
    }

    // Store image to a local directory
    public String storeImage(MultipartFile file) {
        try {
            // Define the directory path where the image will be stored
            Path uploadPath = Paths.get(IMAGE_DIRECTORY);

            // Create the directory if it doesn't exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save the file locally with a unique filename
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());

            // Return the relative URL (for example, "/uploads/{filename}")
            return IMAGE_DIRECTORY + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store the image", e);
        }
    }

    // Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Get posts by user ID
    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    // Create a new post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // Update a post
    public Post updatePost(Long postId, Post updatedPost) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Update the post's title and caption
        post.setPostTitle(updatedPost.getPostTitle());
        post.setPostCaption(updatedPost.getPostCaption());

        // Update the image URL properly
        post.setImageUrl(updatedPost.getImageUrl());

        return postRepository.save(post);
    }

    // Delete a post
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    public Post getPostById(Long postId) {
        return postRepository.findById(postId).orElse(null);
    }
    // Method to like a post
    public Post likePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikes(post.getLikes() + 1);
        return postRepository.save(post);
    }

    // Method to add a comment to a post
    public Post addComment(Long postId, String comment) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.getComments().add(comment);
        return postRepository.save(post);
    }


}
