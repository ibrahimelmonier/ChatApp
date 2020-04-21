@extends('layouts.app')


@section('content')

    <div class="container">

        <div class="row">

            <div class="col-md-3">

                <h3>Online Users</h3>
                <hr>

                <h5 id="no-online-users">No Online Users</h5>

                <ul class="list-group" id="online-users">


                </ul>

            </div>

            <div class="col-md-9 flex flex-column" style="height: 70vh;">

                <div class="h-100 bg-white mb-4 p-5" id="chat" style="overflow: scroll;">
                    @foreach ($messages as $message)

                        <div
                            class="mt-4 w-50 text-white p-3 rounded {{ auth()->user()->id == $message->user_id ? 'float-right bg-primary' : 'float-left bg-success' }}">
                            <p>{{ $message->user->name }}</p>
                            <p>{{ $message->body }}</p>
                        </div>
                        <div class="clearfix"></div>

                    @endforeach
                </div>

                <form action="" class="d-flex">
                    <input type="text" name="" data-url="{{ route('messages.store') }}" class="form-control"
                           style="margin-right: 10px;"
                           id="chat-text">
                    <button class="btn btn-primary">Send</button>
                </form>

            </div>

        </div>

    </div>

@endsection
