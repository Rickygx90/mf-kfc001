import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatButtonModule } from '@angular/material/button';
import { CalendarModule } from 'primeng/calendar';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MenuService } from '../../../services/menu.service';
import { Cadena, Restaurantes } from '../../../models/interfaces';

@Component({
  selector: 'app-filter-menu',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogClose,
    MultiSelectModule,
    CalendarModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.css',
})
export class FilterMenuComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FilterMenuComponent>
  ) {}

  menuService = inject(MenuService);
  cadenas!: Cadena[];
  restaurantes!: Restaurantes[];

  get cadenasSeleccionadas() {
    return this.formularioFiltro.get('cadenasSeleccionadas') as FormControl;
  }
  get restaurantesSeleccionados() {
    return this.formularioFiltro.get(
      'restaurantesSeleccionados'
    ) as FormControl;
  }
  get fechaInicio() {
    return this.formularioFiltro.get('fechaInicio') as FormControl;
  }
  get fechaFin() {
    return this.formularioFiltro.get('fechaFin') as FormControl;
  }

  formularioFiltro = this.formBuilder.group({
    cadenasSeleccionadas: [{ value: [], disabled: false }, Validators.required],
    restaurantesSeleccionados: [
      { value: [], disabled: true },
      Validators.required,
    ],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required],
  });

  ngOnInit() {
    this.cadenas = this.menuService.getCadenas();
  }

  onPanelHideCadenas() {
    console.log('onPanelHide');
    this.restaurantes = this.menuService.getRestaurantes(
      this.cadenasSeleccionadas.value
    );
    if (this.cadenasSeleccionadas.value.length > 0) {
      this.restaurantesSeleccionados.enable();
    } else {
      this.restaurantesSeleccionados.setValue([]);
      this.restaurantesSeleccionados.disable();
    }
  }

  onSubmit() {
    this.menuService.getMenuList(this.formularioFiltro.value);
    this.dialogRef.close();
  }
}
