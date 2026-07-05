<?php
test('add new expense record', function () {
    $user = \App\Models\User::factory()->create();
    $payload = [
        'currency' => 'EUR',
        'description' => 'Bread',
        'amount' => 1.00,
    ];

    $response = $this->actingAs($user)->postJson('/expense-sources', $payload);
    $response->assertStatus(200);
    
    $this->assertDatabaseHas('expense_sources', [
        'user_id' => $user->id,
        'currency' => 'EUR',
        'description' => 'Bread',
        'amount' => 1.00,
    ]);
});