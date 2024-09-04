package com.example.communityservice.controller;

import com.example.communityservice.dto.PostDTO;
import com.example.communityservice.model.Post;
import com.example.communityservice.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community")
@CrossOrigin(origins = "http://localhost:3000", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })
public class CommunityController {

    @Autowired
    private PostService postService;

    // Create a new post
    @PostMapping("/posts")
    public ResponseEntity<PostDTO> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content) {
        PostDTO postDTO = new PostDTO();
        postDTO.setTitle(title);
        postDTO.setContent(content);

        Post post = postService.createPost(postDTO);
        return ResponseEntity.ok(new PostDTO(post.getId(), post.getTitle(), post.getContent()));
    }

    // Get a list of all posts
    @GetMapping("/posts")
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // Get a specific post by ID
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        PostDTO post = postService.getPostById(id);
        return ResponseEntity.ok(post);
    }
}
