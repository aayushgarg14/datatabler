<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;

class ProductController extends Controller 
{
    public function index(Request $request) 
    {
        // $products = Product::orderBy('name', 'asc');

        $products = Product::filter($request);
        $products = $products->paginate(2);
        $response = [
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem()
            ],
            'data' => $products
        ];
        return response()->json($response);
    }

    public function store(Request $request)
    {
        $validateData = $request->validate([
            'name' => 'required',
            'amount' => 'required',
            'type' => 'required',
            'quantity' => 'required',
            'description' => 'required'
        ]);

        $products = Product::create([
            'name' => $validateData['name'],
            'amount' => $validateData['amount'],
            'type' => $validateData['type'],
            'quantity' => $validateData['quantity'],
            'description' => $validateData['description']
        ]);

        return response()->json('Product created!');
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        $product->name = $request->get('name');
        $product->amount = $request->get('amount');
        $product->type = $request->get('type');
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