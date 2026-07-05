<?php
test('add new income record', function () {
    $user = \App\Models\User::factory()->create();
    $payload = [
        'currency' => 'EUR',
        'description' => 'Developer salary',
        'amount' => 1000.00,
    ];

    $response = $this->actingAs($user)->postJson('/income-sources', $payload);
    $response->assertStatus(200);
    
    $this->assertDatabaseHas('income_sources', [
        'user_id' => $user->id,
        'currency' => 'EUR',
        'description' => 'Developer salary',
        'amount' => 1000.00,
    ]);
});