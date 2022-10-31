
class APIFeatures {
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    
    filter(){
         //hard copying
         const queryObj = {...this.queryString};
         
         //Filtering
         const excludingFields = [ 'page', 'sort','limit', 'field'];
         excludingFields.forEach(el=> delete queryObj[el]);
         
         //Advance Filtering
         let queryStr = JSON.stringify(queryObj);
         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/, el => `$${el}`);
         
         console.log(this.queryStr);
         this.query = this.query.find(JSON.parse(queryStr));
         
         return this;
    }
    
    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy);
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    
    limitFiels(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            console.log(fields);
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate(){
        const page = this.queryString.page*1 || 1;
        const limit = this.queryString.limit *1 ||100;
        const skip = (page-1)* limit;
        
        this.query= this.query.skip(skip).limit(limit);
        
        return this;
    }
    
}

module.exports = APIFeatures;