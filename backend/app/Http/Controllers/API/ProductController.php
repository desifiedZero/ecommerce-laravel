<?php
   
namespace App\Http\Controllers\API;
   
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProductController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::all();
    
        return $this->sendResponse(ProductResource::collection($products), 'Products retrieved successfully.');
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
            'name' => 'required',
            'description' => 'required',
            'price' => 'required',
            'image' => 'mimes:jpg,jpeg,png,csv,txt,xlx,xls,pdf',
        ]);
   
        if($validator->fails()){
            return $this->sendError('Please fill out all required information.', $validator->errors(), 400);
        }

        if($request->file()) {
            $file_name = time().'_'.$request->image->getClientOriginalName();
            $file_path = $request->file('image')->storeAs('uploads', $file_name, 'public');
   
            $input['image'] = '/storage/' . $file_path;
        }

        $product = Product::create($input);
   
        return $this->sendResponse(new ProductResource($product), 'Product created successfully.');
    } 
   
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::find($id);
  
        if (is_null($product)) {
            return $this->sendError('Product not found.');
        }

        $user = Auth::guard('sanctum')->user();
        $findAny = Review::where('product_id', $id)->where('user_id', $user->id)->first();

        if ($user && !$findAny) {
            $orders = Order::whereRelation('products', 'products.id', $id)->get()->toArray();
            $product->allowReviews = count($orders) > 0;
        }

        $product->reviews;
        
        foreach ($product->reviews as $reviews) {
            $reviews->username = User::find($reviews->user_id)->name;
        }
   
        return $this->sendResponse(new ProductResource($product), 'Product retrieved successfully.');
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        $input = $request->all();
   
        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required',
            'price' => 'required'
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }
   
        $product->name = $input['name'];
        $product->description = $input['description'];
        $product->price = $input['price'];
        $product->save();
   
        return $this->sendResponse(new ProductResource($product), 'Product updated successfully.');
    }
   
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        $product->delete();
   
        return $this->sendResponse([], 'Product deleted successfully.');
    }

    public function getCartItems(Request $request) {
        $items = $request->all();

        $items = isset($items['products']) ? $items['products'] : [];

        if ($items == null || count($items) < 1) {
            return $this->sendResponse([], "Cart items fetch successfully.");
        }

        $storedItems = Product::whereIn('id', $items)->get();

        return $this->sendResponse($storedItems, 'Cart items fetch successfully.');
    }

    public function search($query)
    {
        $product = Product::query()->where('name', 'LIKE', "%$query%")->get();
  
        if (is_null($product)) {
            return $this->sendError('Product not found.');
        }
   
        return $this->sendResponse(ProductResource::collection($product->all()), 'Product retrieved successfully.');
    }

    public function review(Request $request) {
        $input = $request->all();

        $validator = Validator::make($input, [
            'product_id' => 'required',
            'rating' => 'required',
            'text' => ''
        ]);

        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());       
        }

        $review = Review::create([
            'text' => $input['text'] == null || $input['text'] == '' ? "-" : $input['text'],
            'rating' => $input['rating'],
            'product_id' => $input['product_id'],
            'user_id' => Auth::user()->id,
        ]);

        return $this->sendResponse(null, 'Review added.');
    }
}
