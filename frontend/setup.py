from setuptools import setup, find_packages

setup(
    name="small-webrtc-prebuilt",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "fastapi",
        "uvicorn[standard]"
    ],
    description="Prebuilt Vite frontend for small-webrtc",
    license="BSD 2-Clause License"
)
