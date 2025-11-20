import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Register({ recaptchaSiteKey }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        'g-recaptcha-response': '',
    });

    // Load reCAPTCHA script
    useEffect(() => {
        const loadRecaptcha = () => {
            if (window.grecaptcha) {
                window.grecaptcha.render('g-recaptcha', {
                    sitekey: recaptchaSiteKey,
                    callback: (response) => {
                        setData('g-recaptcha-response', response);
                    },
                    'expired-callback': () => {
                        setData('g-recaptcha-response', '');
                    },
                    'error-callback': () => {
                        setData('g-recaptcha-response', '');
                    },
                });
            }
        };

        // Check if reCAPTCHA is already loaded
        if (window.grecaptcha) {
            loadRecaptcha();
        } else {
            // Wait for reCAPTCHA to load
            const interval = setInterval(() => {
                if (window.grecaptcha) {
                    loadRecaptcha();
                    clearInterval(interval);
                }
            }, 100);
        }

        return () => clearInterval(interval);
    }, [recaptchaSiteKey]);

    const submit = (e) => {
        e.preventDefault();

        if (!data['g-recaptcha-response']) {
            alert('Please complete the reCAPTCHA');
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: () => {
                // Reset reCAPTCHA on error
                if (window.grecaptcha) {
                    window.grecaptcha.reset();
                }
                setData('g-recaptcha-response', '');
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* reCAPTCHA Section */}
                <div className="mt-4">
                    <InputLabel value="Security Verification" />
                    <div id="g-recaptcha" className="mt-1"></div>
                    <InputError message={errors.recaptcha} className="mt-2" />
                    <InputError message={errors['g-recaptcha-response']} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>

            {/* Load reCAPTCHA script */}
            <script src="https://www.google.com/recaptcha/api.js?render=explicit" async defer></script>
        </GuestLayout>
    );
}
