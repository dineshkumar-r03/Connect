package com.careeros.repository;

import com.careeros.entity.Blog;
import com.careeros.entity.Like;
import com.careeros.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndBlog(User user, Blog blog);
    boolean existsByUserAndBlog(User user, Blog blog);
    long countByBlog(Blog blog);
}