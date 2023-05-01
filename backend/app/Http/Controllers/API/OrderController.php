<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\BaseController;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderController extends BaseController
{
    public function placeOrder(Request $request) {
        $input = $request->all();
        $collection = $input;

        $order = Order::create([
            'user_id' => Auth::user()->id
        ]);

        foreach ($collection['products'] as $value) {
            $order->products()->attach([
                $value['product'] => [
                    'count' => $value['count']
                ]
            ]);
            $order->save();
        }

        return $this->sendResponse(null, 'Order placed successfully.');
    }

    public function getAllOrders() {
        $orders = Order::all();
        
        foreach ($orders as $order) {
            $order['user'] = $order->user()->first();
            $order['products'] = $order->products()->get();

            foreach ($order['products'] as $target) {
                $target['count'] = $target->pivot->count;
            }
        }
        return $this->sendResponse($orders, 'Products retrieved successfully.');
    }
}
