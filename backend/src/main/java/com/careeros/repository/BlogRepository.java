package com.careeros.repository;

import com.careeros.entity.Blog;
import com.careeros.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findByAuthor(User author, Pageable pageable);
    long countByAuthor(User author);
    Page<Blog> findByStatus(Blog.Status status, Pageable pageable);
    Page<Blog> findByAuthorAndStatus(User author, Blog.Status status, Pageable pageable);
    
    @Query("SELECT b FROM Blog b WHERE b.status = 'PUBLISHED' AND (b.title LIKE %:query% OR b.content LIKE %:query% OR b.category LIKE %:query%)")
    Page<Blog> search(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT b FROM Blog b WHERE b.status = 'PUBLISHED' ORDER BY b.viewCount DESC")
    Page<Blog> findTrending(Pageable pageable);
    
    @Query("SELECT b FROM Blog b WHERE b.status = 'PUBLISHED' ORDER BY b.likeCount DESC")
    Page<Blog> findMostLiked(Pageable pageable);
    
    @Query("SELECT b FROM Blog b WHERE b.status = 'PUBLISHED' AND b.category = :category")
    Page<Blog> findByCategory(@Param("category") String category, Pageable pageable);
    
    @Query("SELECT b FROM Blog b WHERE b.status = 'PUBLISHED' AND b.tags LIKE %:tag%")
    Page<Blog> findByTag(@Param("tag") String tag, Pageable pageable);
}