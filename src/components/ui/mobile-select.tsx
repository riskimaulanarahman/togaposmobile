"use client";

import { ChangeEvent, Children, Fragment, ReactNode, isValidElement, useEffect, useMemo, useState } from "react";
import { Drawer } from "vaul";

type SelectValue = string | number | readonly string[] | undefined;

export type MobileSelectProps = {
  label: string;
  children: ReactNode;
  value?: SelectValue;
  defaultValue?: SelectValue;
  disabled?: boolean;
  className?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
};

type ParsedOption = {
  value: string;
  label: string;
  disabled: boolean;
};

function readNodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map((item) => readNodeText(item)).join("");
  if (isValidElement(node)) return readNodeText((node.props as { children?: ReactNode }).children);
  return "";
}

function parseOptions(children: ReactNode): ParsedOption[] {
  const parsed: ParsedOption[] = [];

  const walk = (nodes: ReactNode) => {
    Children.forEach(nodes, (node) => {
      if (!isValidElement(node)) return;

      if (node.type === Fragment) {
        walk((node.props as { children?: ReactNode }).children);
        return;
      }

      if (typeof node.type === "string" && node.type === "option") {
        const props = node.props as { value?: string | number; disabled?: boolean; children?: ReactNode };
        const label = readNodeText(props.children).trim();
        parsed.push({
          value: props.value !== undefined ? String(props.value) : label,
          label: label || "Untitled",
          disabled: Boolean(props.disabled),
        });
      }
    });
  };

  walk(children);
  return parsed;
}

function normalizeValue(value: SelectValue): string {
  if (Array.isArray(value)) return value[0] ? String(value[0]) : "";
  if (value === null || value === undefined) return "";
  return String(value);
}

export function MobileSelect({ label, children, value, defaultValue, disabled, className, onChange }: MobileSelectProps) {
  const options = useMemo(() => parseOptions(children), [children]);
  const isControlled = value !== undefined;
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(() => {
    if (defaultValue !== undefined) return normalizeValue(defaultValue);
    return options.find((option) => !option.disabled)?.value ?? "";
  });

  useEffect(() => {
    if (isControlled) return;
    if (options.some((option) => option.value === internalValue)) return;
    setInternalValue(options.find((option) => !option.disabled)?.value ?? "");
  }, [internalValue, isControlled, options]);

  const selectedValue = isControlled ? normalizeValue(value) : internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);
  const selectedLabel = selectedOption?.label ?? "Pilih opsi";

  const handleSelect = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    if (onChange) {
      onChange(
        {
          target: { value: nextValue } as HTMLSelectElement,
          currentTarget: { value: nextValue } as HTMLSelectElement,
        } as ChangeEvent<HTMLSelectElement>,
      );
    }

    setOpen(false);
  };

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>

      <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
        <Drawer.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={[
              "flex w-full items-center justify-between rounded-xl border border-line bg-white px-3 py-2 text-left text-sm text-slate-800 outline-none transition focus-visible:border-accent",
              disabled ? "cursor-not-allowed bg-slate-100 text-slate-400" : "cursor-pointer",
              className ?? "",
            ].join(" ")}
          >
            <span className="truncate">{selectedLabel}</span>
            <span className="text-xs text-slate-400" aria-hidden>
              v
            </span>
          </button>
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/30" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[1.5rem] bg-white shadow-2xl outline-none">
            <div className="mx-auto my-3 h-1.5 w-14 rounded-full bg-slate-200" />
            <div className="max-h-[82dvh] overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="mb-3 flex items-center justify-between">
                <Drawer.Title className="text-sm font-bold text-slate-800">{label}</Drawer.Title>
                <button type="button" className="text-xs font-semibold text-slate-500" onClick={() => setOpen(false)}>
                  Tutup
                </button>
              </div>

              {options.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line px-3 py-2 text-xs text-slate-500">Tidak ada opsi.</p>
              ) : (
                <div className="space-y-1">
                  {options.map((option) => {
                    const isActive = selectedValue === option.value;
                    return (
                      <button
                        key={`${option.value}-${option.label}`}
                        type="button"
                        disabled={option.disabled}
                        onClick={() => handleSelect(option.value)}
                        className={[
                          "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition",
                          option.disabled ? "cursor-not-allowed border-line bg-slate-50 text-slate-400" : "border-line bg-white text-slate-700",
                          isActive ? "border-accent bg-accent/5 text-accent" : "",
                        ].join(" ")}
                      >
                        <span className="truncate">{option.label}</span>
                        {isActive ? <span className="text-[11px] font-semibold">Dipilih</span> : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </label>
  );
}
