<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
    'first_name', 
    'last_name', 
    'date_of_birth', 
    'gender', 
    'address', 
    'phone', 
    'email', 
    'emergency_contact', 
    'medical_history'];

    public function doctors()
    {
        return $this->belongsToMany(Doctor::class);
    }

}
