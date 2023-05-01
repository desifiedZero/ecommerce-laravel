<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BannerController extends BaseController
{
    public function getDisplayable()
    {
        $queryable = true;

        $banner = Banner::query()->when($queryable, function ($query, $queryable) {
             return $query->where('is_enabled', $queryable);
        })->get();
   
        return $this->sendResponse(BannerResource::collection($banner), 'Banners retrieved successfully.');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Banner::all();
    
        return $this->sendResponse(BannerResource::collection($products), 'Banner retrieved successfully.');
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'image' => 'required|mimes:jpg,jpeg,png,csv,txt,xlx,xls,pdf|max:10000',
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }

        if($request->file()) {
            $file_name = time().'_'.$request->image->getClientOriginalName();
            $file_path = $request->file('image')->storeAs('uploads', $file_name, 'public');
   
            $input['image'] = '/storage/' . $file_path;
        }

        $input['is_enabled'] = true;
   
        $product = Banner::create($input);
   
        return $this->sendResponse(new BannerResource($product), 'Banner created successfully.');
    } 
   
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Banner::find($id);
  
        if (is_null($product)) {
            return $this->sendError('Product not found.');
        }
   
        return $this->sendResponse(new BannerResource($product), 'Banner retrieved successfully.');
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Banner $product)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'image' => 'required',
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $product->name = $input['name'];
        $product->description = $input['description'];
        $product->price = $input['price'];
        $product->save();
   
        return $this->sendResponse(new BannerResource($product), 'Banner updated successfully.');
    }
   
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Banner::destroy($id);
   
        return $this->sendResponse([], 'Banner deleted successfully.');
    }

    public function updateBannerActivity(Request $request)
    {
        $input = $request->only('id', 'is_enabled');
   
        $banner = Banner::find($input['id']);
        $banner->update($input);
        $banner->save();
   
        return $this->sendResponse(new BannerResource($banner), 'Banner updated successfully.');
    }
}
