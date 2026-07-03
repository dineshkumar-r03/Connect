package com.careeros.repository;

import com.careeros.entity.Blog;
import com.careeros.entity.Bookmark;
import com.careeros.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserAndBlog(User user, Blog blog);
    boolean existsByUserAndBlog(User user, Blog blog);
    Page<Bookmark> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}