<?php
   
namespace App\Http\Controllers\API;
   
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RegisterController extends BaseController
{
    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'c_password' => 'required|same:password',
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors(), 400);       
        }
   
        $input = $request->all();
        $input['role'] = 'user';
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
        $role = $user['role'];

        $user['token'] =  $user->createToken('ecommerse', ["role-user"])->plainTextToken;
   
        return $this->sendResponse($user, 'User registered successfully.');
    }

        /**
     * Register admin api
     *
     * @return \Illuminate\Http\Response
     */
    public function register_admin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
            'c_password' => 'required|same:password',
        ]);
   
        if($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors(), 400);       
        }
   
        $input = $request->all();
        $input['role'] = 'admin';
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);
   
        return $this->sendResponse($user, 'User registered successfully.');
    }
   
    /**
     * Login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])){ 
            /** @var \App\Models\User $user **/
            $user = Auth::user(); 
            $role = $user['role'];

            $user['token'] =  $user->createToken('ecommerse', ["role-$role"])->plainTextToken;    
            return $this->sendResponse($user, 'User logged in successfully.');
        } 
        else { 
            return $this->sendError('Incorrect email and/or password.', ['error'=>'Incorrect email and/or password'], 400);
        } 
    }

    public function getAllUsers(Request $request)
    {
        $queryable = "user";

        $Category = User::query()->when($queryable, function ($query, $queryable) {
             return $query->where('role', $queryable);
        })->get();
   
        return $this->sendResponse($Category, 'Users retrieved successfully.');
    }

    public function getAllAdmins()
    {
        $queryable = "admin";

        $Category = User::query()->when($queryable, function ($query, $queryable) {
             return $query->where('role', $queryable);
        })->get();
   
        return $this->sendResponse($Category, 'Admins retrieved successfully.');
    }

    public function editUser(Request $request) {
        $input = $request->only('id');
        $user = User::find($input['id']);

        $input = $request->only('name', 'phone');

        if($user != null) {
            $user->update($input);
        }

        $user->save();

        return $this->sendResponse($user, 'User updated successfully.');
    }

    public function deleteUser($id) {
        DB::delete('delete from users where id = ?',[$id]);
    }
}