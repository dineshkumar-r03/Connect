package com.careeros.service;

import com.careeros.entity.Blog;
import com.careeros.entity.Bookmark;
import com.careeros.entity.User;
import com.careeros.repository.BlogRepository;
import com.careeros.repository.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookmarkService {
    
    private final BookmarkRepository bookmarkRepository;
    private final BlogRepository blogRepository;
    
    @Transactional
    public void bookmarkBlog(Long blogId, User user) {
        Blog blog = blogRepository.findById(blogId)
            .orElseThrow(() -> new RuntimeException("Blog not found"));
        
        if (bookmarkRepository.existsByUserAndBlog(user, blog)) {
            throw new RuntimeException("Blog already bookmarked");
        }
        
        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setBlog(blog);
        bookmarkRepository.save(bookmark);
    }
    
    @Transactional
    public void unbookmarkBlog(Long blogId, User user) {
        Blog blog = blogRepository.findById(blogId)
            .orElseThrow(() -> new RuntimeException("Blog not found"));
        
        Bookmark bookmark = bookmarkRepository.findByUserAndBlog(user, blog)
            .orElseThrow(() -> new RuntimeException("Blog not bookmarked"));
        
        bookmarkRepository.delete(bookmark);
    }
    
    public Page<Blog> getUserBookmarks(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Bookmark> bookmarks = bookmarkRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return bookmarks.map(Bookmark::getBlog);
    }
    
    public boolean hasBookmarked(Long blogId, User user) {
        Blog blog = blogRepository.findById(blogId)
            .orElseThrow(() -> new RuntimeException("Blog not found"));
        return bookmarkRepository.existsByUserAndBlog(user, blog);
    }
}