package com.works.glycemic.services;

import com.works.glycemic.config.AuditAwareConfig;
import com.works.glycemic.models.Food;
import com.works.glycemic.repositories.FoodRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FoodService {
    final FoodRepository foodRepository;
    final AuditAwareConfig auditAwareConfig;
    public FoodService(FoodRepository foodRepository, AuditAwareConfig auditAwareConfig) {
        this.foodRepository = foodRepository;
        this.auditAwareConfig = auditAwareConfig;
    }

    //food save
    public Food foodSave(Food food){
        Optional<Food> oFood = foodRepository.findByNameEqualsIgnoreCase(food.getName());
        if(oFood.isPresent()){
            return null;
        }else{
            food.setEnabled(false);
            return foodRepository.save(food);
        }
    }

    //food list
    public List<Food> foodList(){
        return foodRepository.findAll();
    }

    // user food list
    public List<Food> userFoodList(){
        Optional<String> oUserName = auditAwareConfig.getCurrentAuditor();
        if (oUserName.isPresent()) {
            return foodRepository.findByCreatedByEqualsIgnoreCase(oUserName.get());

        }else{
            return new ArrayList<Food>();
        }

    }
    // user food delete
    public Food userFoodDelete(long gid){
            Optional<String> oUserName = auditAwareConfig.getCurrentAuditor();
            if (oUserName.isPresent()) {
                Optional<Food> fd = foodRepository.findByGidIsAndCreatedByEqualsIgnoreCase(gid,oUserName.get());
                    if (fd.isPresent()){
                        foodRepository.deleteById(gid);
                        return fd.get();
                    }else{
                        return null;
                    }
            }else{
                return null;
            }

        }
    // user food update
    public Food userFoodUpdate(Food food){
        Optional<String> oUserName = auditAwareConfig.getCurrentAuditor();
        if (oUserName.isPresent()) {
            Optional<Food> fd = foodRepository.findByGidIsAndCreatedByEqualsIgnoreCase(food.getGid(),oUserName.get());
            if (fd.isPresent()){
                food.setCreatedBy(fd.get().getCreatedBy());
                food.setCreatedDate(fd.get().getCreatedDate());
                food.setEnabled(false);
                return foodRepository.saveAndFlush(food);

            }else{
                return null;
            }
        }else{
            return null;
        }

    }
}
