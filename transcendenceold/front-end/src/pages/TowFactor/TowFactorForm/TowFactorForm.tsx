import React, { useEffect, useRef, KeyboardEvent, ClipboardEvent} from 'react'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./TowFactorFormStyle.css"
import { validateTowFactor } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';
import { UserType } from '../../../types';
import { useConnectedUser } from '../../../context/ConnectedContext';

function TowFactorForm() {

    const { setConnectedUser } = useConnectedUser();

    const inputs = useRef<HTMLInputElement[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        inputs.current.forEach((input, index) => {
            if (index === 0) input.focus();
            input?.addEventListener("keydown", handleKeyDown as unknown as EventListener);
            input?.addEventListener("paste", handlePaste as unknown as EventListener);
        });

        return () => {
            inputs.current.forEach((input) => {
                input?.removeEventListener("keydown", handleKeyDown as unknown as EventListener);
                input?.removeEventListener("paste", handlePaste as unknown as EventListener);
            });
        };
    }, []);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const key = e.key;

        if (!isConnectedInput(input)) return;

        switch (key) {
            case "ArrowLeft":
                if (input.selectionStart === 0 && input.selectionEnd === 0) {
                    const previous = input.previousElementSibling as HTMLInputElement;
                    if (previous === null) return;
                    previous.focus();
                    previous.selectionStart = previous.value.length - 1;
                    previous.selectionEnd = previous.value.length - 1;
                    e.preventDefault();
                }
                break;
            case "ArrowRight":
                if (
                    input.selectionStart === input.value.length &&
                    input.selectionEnd === input.value.length
                ) {
                    const next = input.nextElementSibling as HTMLInputElement;
                    if (next === null) return;
                    next.focus();
                    next.selectionStart = 1;
                    next.selectionEnd = 1;
                    e.preventDefault();
                }
                break;
            case "Delete":
                if (
                    input.selectionStart === input.value.length &&
                    input.selectionEnd === input.value.length
                ) {
                    const next = input.nextElementSibling as HTMLInputElement;
                    if (next === null) return;
                    next.value = next.value.substring(1);
                    next.focus();
                    next.selectionStart = 0;
                    next.selectionEnd = 0;
                    e.preventDefault();
                }
                break;
            case "Backspace":
                if (input.selectionStart === 0 && input.selectionEnd === 0) {
                    const previous = input.previousElementSibling as HTMLInputElement;
                    if (previous === null) return;
                    previous.value = previous.value.substring(0, previous.value.length - 1);
                    previous.focus();
                    previous.selectionStart = previous.value.length;
                    previous.selectionEnd = previous.value.length;
                    e.preventDefault();
                }
                break;
            default:
                if (e.ctrlKey || e.altKey) return;
                if (key.length > 1) return;
                if (key.match(/^[^0-9]$/)) return e.preventDefault();
                e.preventDefault();
                onInputChange(input, key);
                break;
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const data = e.clipboardData.getData("text");

        if (!isConnectedInput(input)) return;
        if (!data.match(/^[0-9]+$/)) return e.preventDefault();

        e.preventDefault();
        onInputChange(input, data);
    };

    const isConnectedInput = (input: HTMLInputElement) => {
        const parent = input.closest("[data-connected-inputs]");
        return input.matches("input") && parent != null;
    };

    const onInputChange = (input: HTMLInputElement, newValue: string) => {
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;

        updateInputValue(input, newValue, start, end);
        focusInput(input, newValue.length + start);
    };

    const updateInputValue = (input: HTMLInputElement, extraValue: string, start = 0, end = 0) => {
        const newValue = `${input.value.substring(0, start)}${extraValue}${input.value.substring(end, 1)}`;

        input.value = newValue.substring(0, 1);

        if (newValue.length > 1) {
            const next = input.nextElementSibling as HTMLInputElement;
            if (next === null) return;
            updateInputValue(next, newValue.substring(1));
        }
    };

    const focusInput = (input: HTMLInputElement, dataLength: number) => {
        let addedCharacters = dataLength;
        let currentInput: HTMLInputElement | null = input;

        while (addedCharacters > 1 && currentInput?.nextElementSibling != null) {
            addedCharacters -= 1;
            currentInput = currentInput.nextElementSibling as HTMLInputElement;
        }

        if (addedCharacters > 1) addedCharacters = 1;

        currentInput?.focus();
        currentInput.selectionStart = addedCharacters;
        currentInput.selectionEnd = addedCharacters;
    };

    const handleSubmit = async () => {
        const code: string = inputs.current.reduce((acc, input) => acc + input.value, "");

        if (code.length < 6) {
            toast.warning("The two factor validation code length must be 6 characters");
        } else {
            

            const newUser: UserType | null = await validateTowFactor(parseInt(code));

            if (newUser) {
                toast.success("Your two-factor authentication has been successfully verified");
                setConnectedUser(newUser);
                navigate("/profile")
            } else {
                toast.warning("Your two-factor authentication code is not correct");
            }

            if (parseInt(code) === 123456) {
                toast.success("Your two-factor authentication has been successfully verified");
            } else {
                toast.warning("Your two-factor authentication code is not correct");
            }
        }
    };


  return (

    <>
        <ToastContainer />
        <section className="two-factor-form">
            <div className="two-factor-inputs" data-connected-inputs>
                {[...Array(6)].map((_, index) => (
                    <input
                        key={`key-${index}`}
                        maxLength={1}
                        type="text"
                        ref={(el) => (inputs.current[index] = el as HTMLInputElement)}
                        className="two-factor-input"
                    />
                ))}
            </div>
            <div className="actions-buttons">
                <input
                    className="action-button button-active"
                    type="submit"
                    value="Submit"
                    onClick={() => handleSubmit()}
                />
            </div>
        </section>
    
    </>
  )
}

export default TowFactorForm
