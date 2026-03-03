import React, { InputHTMLAttributes, FC } from "react";
import styled from "styled-components";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // optional label allows placeholder-only inputs (e.g. search fields)
  label?: string;
  error?: string;
}

const Input: FC<InputProps> = ({
  label,
  error,
  id,
  required,
  ...props
}) => {
  // if no explicit id is provided, derive one from label (if available)
  const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  return (
    <StyledWrapper>
      <div className={`wave-group ${error ? "error" : ""}`}>
        <input
          // only add id attribute if we have one
          {...(inputId ? { id: inputId } : {})}
          required={required}
          className="input"
          {...props}
        />

        <span className="bar" />

        {/* render floating label only when label prop is provided */}
        {label && (
          <label htmlFor={inputId} className="label">
            {label.split("").map((char, index) => (
              <span
                key={index}
                className="label-char"
                style={
                  { "--index": index } as React.CSSProperties
                }
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </label>
        )}
      </div>

      {error && <span className="error-text">{error}</span>}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;

  .wave-group {
    position: relative;
    width: 100%;
  }

  .input {
    font-size: 16px;
    padding: 10px 10px 10px 5px;
    display: block;
    width: 100%;
    border: none;
    border-bottom: 1px solid #515151;
    background: transparent;
  }

  .input:focus {
    outline: none;
  }

  .label {
    color: #999;
    font-size: 18px;
    position: absolute;
    pointer-events: none;
    left: 5px;
    top: 10px;
    display: flex;
  }

  .label-char {
    transition: 0.2s ease all;
    transition-delay: calc(var(--index) * 0.05s);
  }

  .input:focus ~ .label .label-char,
  .input:valid ~ .label .label-char {
    transform: translateY(-20px);
    font-size: 14px;
    color: #5264ae;
  }

  .bar {
    position: relative;
    display: block;
    width: 100%;
  }

  .bar:before,
  .bar:after {
    content: "";
    height: 2px;
    width: 0;
    bottom: 1px;
    position: absolute;
    background: #5264ae;
    transition: 0.2s ease all;
  }

  .bar:before {
    left: 50%;
  }

  .bar:after {
    right: 50%;
  }

  .input:focus ~ .bar:before,
  .input:focus ~ .bar:after {
    width: 50%;
  }

  /* Error State */
  .error .input {
    border-bottom: 1px solid red;
  }

  .error .label-char {
    color: red !important;
  }

  .error-text {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    display: block;
  }
`;

export default Input;