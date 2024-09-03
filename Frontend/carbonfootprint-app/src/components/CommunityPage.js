import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommunityPage = () => {
  const [newPost, setNewPost] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState(null);

  // Handle form field changes
  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to handle image upload
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    formData.append('caption', newPost.caption);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axios.post('http://localhost:8082/api/community/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewPost({ title: '', content: '', caption: '' });
      setImageFile(null);
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error creating post:', error);
    }
};
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/community/posts');
      setLatestPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLikePost = async (postId) => {
    try {
      await axios.post(`http://localhost:8082/api/community/posts/${postId}/like`);
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (postId, commentContent) => {
    try {
      await axios.post(`http://localhost:8082/api/community/posts/${postId}/comments`, { content: commentContent });
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Community Support</h1>
        <nav className="space-x-6 flex items-center">
          <a href="/" className="mx-4 hover:text-blue-500">Home</a>
          <a href="/carbontracker" className="mx-4 hover:text-blue-500">Carbon Tracker</a>
          <a href="/authpage" className="mx-4 hover:text-blue-500">Login</a>
          <a href="/authpage" className="mx-4 hover:text-blue-500">Register</a>
          <div className="relative mx-4">
            <input
              type="text"
              placeholder="Search posts"
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </nav>
      </header>

      <main className="mt-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Create a Post</h2>
          <form onSubmit={handlePostSubmit}>
            <textarea
              rows={4}
              placeholder="Write your post here"
              value={newPost}
              onChange={handlePostChange}
              className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2"
                onClick={() => console.log('Draft saved')}
              >
                Draft
              </button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Publish
              </button>
            </div>
          </form>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Latest Community Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {latestPosts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 12h15m-15 0l1.5 1.5m-1.5-1.5l1.5-1.5M9 12h6m-6 0l1.5 1.5m-1.5-1.5l1.5-1.5M12 15h3.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold">{post.username}</h3>
                </div>
                {post.image && (
                  <img src={post.image} alt="Post Image" className="w-full h-48 object-cover rounded-lg mt-2" />
                )}
                <p className="mt-2">{post.content}</p>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="bg-gray-400 text-white px-2 py-1 rounded-lg"
                  >
                    Like
                  </button>
                  <button
                    onClick={() => handleCommentSubmit(post.id, 'Great post!')}
                    className="bg-gray-400 text-white px-2 py-1 rounded-lg"
                  >
                    Comment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Community App</p>
      </footer>
    </div>
  );
};

export default CommunityPage;
