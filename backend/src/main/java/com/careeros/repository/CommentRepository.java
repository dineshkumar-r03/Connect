package com.careeros.repository;

import com.careeros.entity.Blog;
import com.careeros.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByBlogAndParentIsNullOrderByCreatedAtDesc(Blog blog, Pageable pageable);
    List<Comment> findByParentOrderByCreatedAtAsc(Comment parent);
    long countByBlog(Blog blog);
}