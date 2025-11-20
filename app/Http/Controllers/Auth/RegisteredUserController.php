<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'recaptchaSiteKey' => config('services.recaptcha.site_key'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'g-recaptcha-response' => 'required',
        ]);

        // Verify reCAPTCHA
        $recaptchaResponse = $this->verifyRecaptcha($request->input('g-recaptcha-response'));

        if (!$recaptchaResponse['success']) {
            return back()->withErrors([
                'recaptcha' => 'reCAPTCHA verification failed. Please try again.',
            ]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Regenerate the session to avoid session fixation and ensure
        // Inertia receives the updated auth shared props immediately.
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Verify reCAPTCHA response
     */
    private function verifyRecaptcha(string $recaptchaResponse): array
    {
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('services.recaptcha.secret_key'),
            'response' => $recaptchaResponse,
            'remoteip' => request()->ip(),
        ]);

        return $response->json();
    }
}
