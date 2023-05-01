<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id'
    ];

    public function products() {
        return $this->belongsToMany(Product::class, 'product_order')->withPivot('count');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
