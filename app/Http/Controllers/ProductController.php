<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;

class ProductController extends Controller 
{
    public function index() 
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validateData = $request->validate([
            'name' => 'required',
            'description' => 'required'
        ]);

        $project = Project::create([
            'name' => $validateData['name'],
            'description' => $validateData['description']
        ]);

        return response()->json('Project created!');
    }
}