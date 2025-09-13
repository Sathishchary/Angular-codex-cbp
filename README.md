# DataglanceExecutor

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Converting documents to cbp.json

The repository provides a Python script (`convert_to_cbp.py`) that converts DOCX and PDF files into a structured `cbp.json` format suitable for nuclear industry procedures.

### Installation

Install required Python dependencies:

```bash
pip install -r requirements.txt
```

### Usage

```bash
python3 convert_to_cbp.py <input.docx|input.pdf> output.json
```

### Examples

```bash
# Convert DOCX to CBP
python3 convert_to_cbp.py DocxCBP/MCI-0-000-PCK001.docx output.json

# Convert PDF to CBP  
python3 convert_to_cbp.py sample_nuclear_procedure.pdf output.json
```

### Dependencies

- **pdfminer.six**: Required for PDF file processing
- **Python 3.6+**: Minimum Python version required
