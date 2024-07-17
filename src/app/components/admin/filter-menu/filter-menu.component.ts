import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
  MAT_DIALOG_DATA,
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
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MenuService } from '../../../services/menu.service';
import { Observable } from 'rxjs';
import { CadenaI, RestauranteI } from '../../../models/interfaces';

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
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.css',
})
export class FilterMenuComponent implements OnInit {
  public cadenas$!: Observable<CadenaI[] | any>;
  public restaurantes$!: Observable<RestauranteI[] | any>;
  public menus$!: Observable<any[] | any>;
  btnBuscarDisabled = false;
  btnCancelarDisabled = false;
  showLoading = false;
  menuService = inject(MenuService);

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FilterMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.cadenas$ = this.menuService.getCadenasToSelect();
  }

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

  onPanelHideCadenas() {
    this.restaurantesSeleccionados.setValue([]);
    if (this.cadenasSeleccionadas.value.length > 0) {
      this.restaurantes$ = this.menuService.getRestaurantesToSelect(
        this.cadenasSeleccionadas.value
      );
      this.restaurantesSeleccionados.enable();
    } else {
      this.restaurantesSeleccionados.disable();
    }
  }

  onSubmit() {
    this.formularioFiltro.disable();
    this.showLoading = true;
    this.menuService
      .getMenuToSelectCheckbox({
        formularioFiltro: this.formularioFiltro.value,
        data: this.data,
      })
      .subscribe({
        next: (menus) => {
          console.log(menus);
          this.dialogRef.close({
            menus,
            formularioFiltro: this.formularioFiltro.value,
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
