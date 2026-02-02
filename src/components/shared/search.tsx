import { useRef, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { Button } from "../ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
} from "../ui/input-group";

type SearchProps = {
    name: string;
    defaultValue: string;
    formAction: (formData: FormData) => void;
};

export default function Search({
    name,
    defaultValue,
    formAction,
}: SearchProps) {
    const [value, setValue] = useState(defaultValue);
    const formRef = useRef<HTMLFormElement>(null);

    const handleClear = () => {
        setValue("");

        // trigger submit setelah value dikosongkan
        requestAnimationFrame(() => {
            formRef.current?.requestSubmit();
        });
    };

    return (
        <form
            ref={formRef}
            className="flex gap-3"
            action={formAction}
        >
            <InputGroup>
                <InputGroupInput
                    name={name}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Cari"
                />

                <InputGroupAddon>
                    <InputGroupText>
                        <BiSearch />
                    </InputGroupText>
                </InputGroupAddon>

                {value && (
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            type="button"
                            onClick={handleClear}
                        >
                            <BiX />
                        </InputGroupButton>
                    </InputGroupAddon>
                )}
            </InputGroup>

            <Button size="icon" type="submit">
                <BiSearch />
            </Button>
        </form>
    );
}
