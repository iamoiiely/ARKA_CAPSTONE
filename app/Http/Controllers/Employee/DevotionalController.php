<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Devotional;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DevotionalController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $today = Carbon::today();

        $todaysDevotional = Devotional::query()
            ->where('user_id', $user->id)
            ->where('date', $today->toDateString())
            ->first();

        $records = Devotional::query()
            ->where('user_id', $user->id)
            ->when($request->filled('from'), fn ($q) => $q->whereDate('date', '>=', $request->date('from')))
            ->when($request->filled('to'), fn ($q) => $q->whereDate('date', '<=', $request->date('to')))
            ->orderByDesc('date')
            ->paginate(15)
            ->withQueryString();

        $monthCount = Devotional::query()
            ->where('user_id', $user->id)
            ->whereBetween('date', [$today->copy()->startOfMonth(), $today->copy()->endOfMonth()])
            ->count();

        $workingDaysSoFar = $today->copy()->startOfMonth()->diffInWeekdays($today) + 1;

        return Inertia::render('employee/devotional/index', [
            'todaysDevotional' => $todaysDevotional,
            'records' => $records,
            'filters' => $request->only(['from', 'to']),
            'compliance' => "{$monthCount}/{$workingDaysSoFar} days",
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'file' => ['required', 'file', 'mimes:pdf,docx,jpg,jpeg,png', 'max:10240'],
        ]);

        $today = Carbon::today();

        if (Devotional::query()->where('user_id', $request->user()->id)->where('date', $today->toDateString())->exists()) {
            return back()->withErrors(['file' => "You've already submitted today's devotional."]);
        }

        $file = $request->file('file');
        $path = $file->store('devotionals', 'public');

        Devotional::create([
            'user_id' => $request->user()->id,
            'date' => $today->toDateString(),
            'title' => $data['title'],
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'submitted_at' => now(),
        ]);

        return back();
    }
}
