@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h5>Users</h5>
                    </div>
                    <div class="card-body">
                        @if (session('status'))
                            <div class="alert alert-success" role="alert">
                                {{ session('status') }}
                            </div>
                        @endif
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($users as $item)
                                    <tr>
                                        <td>{{ $item->id }}</td>
                                        <td>{{ $item->name }}</td>
                                        <td>
                                            <a href="?id={{ $item->id }}" class="btn btn-primary">Edit</a>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h5>{{ $user ? 'Update' : 'Create' }} User</h5>
                    </div>
                    <div class="card-body">
                        <form action="user" method="POST">
                            @csrf
                            @if ($user)
                                <input type="hidden" name="id" value="{{ $user->id }}">
                            @endif
                            <div class="form-group mb-4">
                                <label for="name">name</label>
                                <input type="text" name="name" value="{{ $user ? $user->name : '' }}" id="name" class="form-control">
                            </div>
                            <div class="form-group mb-4">
                                <button type="submit" class="btn btn-primary"> Submit </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
