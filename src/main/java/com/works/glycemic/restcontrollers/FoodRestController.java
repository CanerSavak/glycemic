package com.works.glycemic.restcontrollers;

import com.works.glycemic.models.Food;
import com.works.glycemic.services.FoodService;
import com.works.glycemic.utils.REnum;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*",allowedHeaders = "*")
@RestController
@RequestMapping("/food")
public class FoodRestController {

    final FoodService foodService;

    public FoodRestController(FoodService foodService) {
        this.foodService = foodService;
    }

    //food save
    @PostMapping("/save")
    public Map<REnum,Object> foodsave(@RequestBody Food food){
        Map<REnum,Object> hm = new LinkedHashMap<>();
        Food f = foodService.foodSave(food);
        if( f == null ) {
            hm.put(REnum.status, false );
            hm.put(REnum.message, "Bu ürün daha önce kayıt edilmiş" );
            hm.put(REnum.result, f);
        }else {
            hm.put(REnum.status, true );
            hm.put(REnum.message, "Ürün kaydı başarılı" );
            hm.put(REnum.result, f);
        }
        return hm;

    }
    @GetMapping("detail/{url}")
    public Map<REnum,Object> singleFoodUrl(@PathVariable String url){
        Optional<Food> oFoods = foodService.singleFood(url);
        Map<REnum,Object> hm = new LinkedHashMap<>();
        if (oFoods.isPresent()){
            hm.put(REnum.status, false );
            hm.put(REnum.message, "Ürün Detayı Alındı" );
            hm.put(REnum.result, oFoods.get());
        }else{
            hm.put(REnum.status, false );
            hm.put(REnum.message, "Ürü Detay bulunamadı" );
            hm.put(REnum.result, null);
        }
        return hm;
    }


    //food list
    @Cacheable("food_list")
    @GetMapping("/list")
    public Map<REnum,Object> list() {
        Map<REnum, Object> hm = new LinkedHashMap<>();
        hm.put(REnum.status, true );
        hm.put(REnum.message, "Ürün listesi" );
        hm.put(REnum.result, foodService.foodList());
        return hm;
    }

    // user food list
    @GetMapping("/userFoodList")
    public Map<REnum,Object> userFoodList() {
        Map<REnum, Object> hm = new LinkedHashMap<>();
        hm.put(REnum.status, true );
        hm.put(REnum.message, "Ürün listesi" );
        hm.put(REnum.result, foodService.userFoodList());
        return hm;
    }

    // foods List
    @GetMapping("/adminWaitFoodList")
    public Map<REnum, Object> adminWaitFoodList() {
        Map<REnum, Object> hm = new LinkedHashMap<>();
        hm.put(REnum.status, true);
        hm.put(REnum.message, "Ürün Listesi");
        hm.put(REnum.result, foodService.adminWaitFoodList());
        return hm;
    }




    // list delete
    @DeleteMapping("/foodDelete")
    public Map<REnum, Object> foodDelete(@RequestParam long gid) {
        return foodService.foodDelete(gid);
    }


    //  food update
    @PutMapping("foodUpdate")
    public Map<REnum,Object> foodUpdate(@RequestBody Food food){
        return foodService.userUpdateFood(food);
    }



}
