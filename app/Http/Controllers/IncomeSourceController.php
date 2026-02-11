<?php
namespace App\Http\Controllers;
use App\Models\IncomeSource;
use Illuminate\Http\Request;

class IncomeSourceController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'description' => 'required|string',
            'amount' => 'required|numeric',
            'currency' => 'required|string',
            'updated_at' => 'nullable|date_format:Y-m-d',
        ]);
        $validatedData['user_id'] = $request->user()->id;
        IncomeSource::create($validatedData);
        return response()->json(['message' => 'Ienākumu avots saglabāts veiksmīgi']);
    }

    public function index(Request $request)
    {
        $month = $request->query('month');
        $incomeSources = IncomeSource::query()
            ->where('user_id', $request->user()->id);
        if ($month) {
            $incomeSources->whereMonth('updated_at', $month);
        }

        $filteredIncomeSources = $incomeSources->get();
        $sum = $filteredIncomeSources->sum('amount');

        return response()->json([
            "incomeSources" => $filteredIncomeSources,
            "sum" => $sum
        ]);
    }

    public function update(Request $request, $id)
    {
        $incomeSource = IncomeSource::findOrFail($id);
        $request->validate([
            'description' => 'required|string',
            'amount' => 'required|numeric',
            'currency' => 'required|string',
            'updated_at' => 'nullable|date_format:Y-m-d',
        ]);

        $incomeSource->update([
            'description' => $request->description,
            'amount' => $request->amount,
            'currency' => $request->currency,
            'updated_at' => $request->updated_at,
        ]);
        return response()->json(['message' => 'Ienākumu avots atjaunināts!']);
    }

    public function destroy(IncomeSource $incomeSource)
    {
        if ($incomeSource) {
            $incomeSource->delete();
            return response()->json(['message' => 'Ienākumu avots veiksmīgi dzēsts.']);
        } 
        else 
        {
            return response()->json(['message' => 'Ienākumu avots netika atrasts.'], 404);
        }
    }
}