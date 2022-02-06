package com.works.glycemic.repositories;


import com.works.glycemic.models.Food;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FoodRepository extends JpaRepository<Food,Long> {
    Optional<Food> findByNameEqualsIgnoreCase(String name);

    List<Food> findByCreatedByEqualsIgnoreCase(String createdBy);

    Optional<Food> findByGidIsAndCreatedByEqualsIgnoreCase(Long gid, String createdBy);





}
