<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends BaseController
{
    public function getDisplayable()
    {
        $queryable = true;

        $Category = Category::query()->when($queryable, function ($query, $queryable) {
             return $query->where('is_enabled', $queryable);
        })->get();
   
        return $this->sendResponse(CategoryResource::collection($Category), 'Categorys retrieved successfully.');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categorys = Category::all();
    
        return $this->sendResponse(CategoryResource::collection($categorys), 'Products retrieved successfully.');
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(!auth()->guard('admin')->check()) 
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised'], 401);

        $input = $request->all();
   
        $validator = Validator::make($input, [
            'image' => 'required',
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $category = Category::create($input);
   
        return $this->sendResponse(new CategoryResource($category), 'Product created successfully.');
    } 
   
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $category = Category::find($id);
  
        if (is_null($category)) {
            return $this->sendError('Product not found.');
        }
   
        return $this->sendResponse(new CategoryResource($category), 'Product retrieved successfully.');
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Category $category)
    {
        if(!auth()->guard('admin')->check()) 
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised'], 401);

        $input = $request->all();
   
        $validator = Validator::make($input, [
            'image' => 'required',
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $category->name = $input['name'];
        $category->description = $input['description'];
        $category->price = $input['price'];
        $category->save();
   
        return $this->sendResponse(new CategoryResource($category), 'Product updated successfully.');
    }
   
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        if(!auth()->guard('admin')->check()) 
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised'], 401);

        $category->delete();
   
        return $this->sendResponse([], 'Product deleted successfully.');
    }
}
