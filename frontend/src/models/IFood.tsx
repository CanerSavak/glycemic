export interface IFoods {
    status?:  boolean;
    message?: string;
    result?:  ResultFoods[];
}
export interface ISingleFood {
    status?:  boolean;
    message?: string;
    result?:  ResultFoods;}


export interface ResultFoods {     
    createdDate?:   number;
    modifiedDate?:  number;
    createdBy?:     string;
    modifiedBy?:    string;
    gid?:           number;
    cid?:           number;
    name?:          string;
    glycemicindex?: number;
    image?:         string;
    source?:        string;
    enabled?:       boolean;
    url?:           string;
}
