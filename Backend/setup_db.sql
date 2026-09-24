-- Script de inicialización de Base de Datos para EasyTool
-- Motor: Microsoft SQL Server (2019/2022)

-- 1. Crear la base de datos principal
CREATE DATABASE EasyToolDB;
GO

USE EasyToolDB;
GO

-- Nota: Las tablas, relaciones y constraints (negocios, usuarios, productos, etc.)
-- NO se crean manualmente aquí.
-- El Backend (FastAPI + SQLAlchemy) se encarga de generar toda la estructura 
-- de tablas de forma automática al momento de ejecutar `uvicorn app.main:app --reload`
-- gracias al engine de SQLAlchemy en el archivo `main.py`.
