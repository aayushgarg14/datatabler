<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;

class ProductController extends Controller 
{
    public function index() 
    {
        $products = Product::all();
        return $products->toJson();
    }

    public function store(Request $request)
    {
        $validateData = $request->validate([
            'name' => 'required',
            'quantity' => 'required',
            'description' => 'required'
        ]);

        $products = Product::create([
            'name' => $validateData['name'],
            'quantity' => $validateData['quantity'],
            'description' => $validateData['description']
        ]);

        return response()->json('Product created!');
    }
}