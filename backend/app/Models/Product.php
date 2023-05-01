<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'image'
    ];

    public function categories() {
        return $this->belongsToMany(Category::class, 'product_category');
    }

    public function orders() {
        return $this->belongsToMany(Order::class, 'product_order');
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }
}
