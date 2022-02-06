package com.works.glycemic.restcontrollers;

import com.works.glycemic.models.Food;
import com.works.glycemic.services.FoodService;
import com.works.glycemic.utils.REnum;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;


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

    //food list
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

    // user food delete
    @DeleteMapping("/userFoodDelete")
    public Map<REnum,Object> userFoodDelete(@RequestParam(name = "gid") long gid) {
        Map<REnum, Object> hm = new LinkedHashMap<>();
        Food food = foodService.userFoodDelete(gid);
        if(food == null) {
            hm.put(REnum.status, false);
            hm.put(REnum.message, "Bu ürünü silme yetkiniz bulunmamaktadır!");
        }else{
            hm.put(REnum.status, true);
            hm.put(REnum.message, "Ürün başarıyla silindi");
        }
       return hm;
        }

    //user food update
    @PutMapping("/userFoodUpdate")
    public Map<REnum,Object> userFoodUpdate(@RequestBody Food food) {
        Map<REnum, Object> hm = new LinkedHashMap<>();
        Food uFood = foodService.userFoodUpdate(food);
        if(uFood == null) {
            hm.put(REnum.status, false);
            hm.put(REnum.message, "Güncelleme işlemi başarısız!");
        }else{
            hm.put(REnum.status, true);
            hm.put(REnum.message, "Güncelleme işlemi tamamlandı");
            hm.put(REnum.result, uFood);
        }
        return hm;
    }


}
