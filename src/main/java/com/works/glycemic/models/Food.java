package com.works.glycemic.models;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gid", nullable = false)
    private Long gid;

    private Integer cid;
    private String  name;
    private Integer glycemicindex;
    @Column(length = 10000)
    private String image;
    private String source;
}
