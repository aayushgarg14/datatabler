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

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        $product->name = $request->get('name');
        $product->quantity = $request->get('quantity');
        $product->description = $request->get('description');
        $product->save();

        return response()->json('Product Updated Successfully!!!');
    }

    public function delete($id)
    {
        $product = Product::find($id);
        $product->delete();

        return response()->json('Product Deleted Successfully!!!');
    }
}