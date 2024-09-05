package com.example.communityservice.controller;

import com.example.communityservice.model.Post;
import com.example.communityservice.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/community")
@CrossOrigin(origins = "http://localhost:3000", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })
public class CommunityController {

    @Autowired
    private final PostService postService;

    public CommunityController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUserId(@PathVariable Long userId) {
        return postService.getPostsByUserId(userId);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPostById(@PathVariable Long postId) {
        Post post = postService.getPostById(postId);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(post);
    }

    @PostMapping("/upload")
    public ResponseEntity<Post> createPostWithImage(
            @RequestParam("userId") Long userId,
            @RequestParam("postTitle") String postTitle,
            @RequestParam("postCaption") String postCaption,
            @RequestParam("image") MultipartFile image) {

        String imageUrl = postService.storeImage(image);  // Store image on server and get URL

        Post newPost = new Post();
        newPost.setUserId(userId);
        newPost.setPostTitle(postTitle);
        newPost.setPostCaption(postCaption);
        newPost.setImageUrl(imageUrl);  // Save the image URL

        Post savedPost = postService.createPost(newPost);
        return ResponseEntity.ok(savedPost);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Post> updatePost(@PathVariable Long postId, @RequestBody Post post) {
        Post updatedPost = postService.updatePost(postId, post);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // Endpoint to like a post
    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> likePost(@PathVariable Long postId) {
        Post likedPost = postService.likePost(postId);
        return ResponseEntity.ok(likedPost);
    }

    // Endpoint to add a comment
    @PostMapping("/{postId}/comment")
    public ResponseEntity<Post> addComment(@PathVariable Long postId, @RequestParam String comment) {
        Post updatedPost = postService.addComment(postId, comment);
        return ResponseEntity.ok(updatedPost);
    }
}
